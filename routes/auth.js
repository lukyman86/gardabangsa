const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const supabase = require('../config/supabase');

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        error: req.query.error || null,
        redirect: req.query.redirect || '/'
    });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password, redirect } = req.body;

        if (!email || !password) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Email dan password harus diisi',
                redirect
            });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Email atau password salah',
                redirect
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Email atau password salah',
                redirect
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            region: user.region
        };

        const redirectPath = redirect || (user.role === 'anggota' ? '/dashboard' : '/admin/dashboard');
        res.redirect(redirectPath);
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login',
            error: 'Terjadi kesalahan pada server',
            redirect: req.body.redirect || '/'
        });
    }
});

router.get('/register', (req, res) => {
    res.render('auth/register', {
        title: 'Daftar Akun',
        error: null
    });
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, password_confirm, region } = req.body;

        if (!name || !email || !password || !region) {
            return res.render('auth/register', {
                title: 'Daftar Akun',
                error: 'Semua field harus diisi'
            });
        }

        if (password !== password_confirm) {
            return res.render('auth/register', {
                title: 'Daftar Akun',
                error: 'Password tidak cocok'
            });
        }

        if (password.length < 6) {
            return res.render('auth/register', {
                title: 'Daftar Akun',
                error: 'Password minimal 6 karakter'
            });
        }

        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.render('auth/register', {
                title: 'Daftar Akun',
                error: 'Email sudah terdaftar'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { error } = await supabase.from('users').insert([{
            name,
            email,
            password: hashedPassword,
            region,
            role: 'anggota'
        }]);

        if (error) {
            return res.render('auth/register', {
                title: 'Daftar Akun',
                error: 'Gagal mendaftar. Silakan coba lagi.'
            });
        }

        res.render('auth/register-success', {
            title: 'Pendaftaran Berhasil',
            email
        });
    } catch (error) {
        console.error('Register error:', error);
        res.render('auth/register', {
            title: 'Daftar Akun',
            error: 'Terjadi kesalahan pada server'
        });
    }
});

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password', {
        title: 'Lupa Password'
    });
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.render('auth/forgot-password', {
                title: 'Lupa Password',
                error: 'Email harus diisi'
            });
        }

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) {
            return res.render('auth/forgot-password-sent', {
                title: 'Email Terkirim',
                email
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await supabase.from('password_resets').insert([{
            email,
            token: resetToken,
            expires_at: expiresAt
        }]);

        const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        console.log('Reset link:', resetLink);

        res.render('auth/forgot-password-sent', {
            title: 'Email Terkirim',
            email
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.render('auth/forgot-password', {
            title: 'Lupa Password',
            error: 'Terjadi kesalahan pada server'
        });
    }
});

router.get('/reset-password', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.render('errors/404', {
                title: 'Link Tidak Valid'
            });
        }

        const { data: resetRecord } = await supabase
            .from('password_resets')
            .select('*')
            .eq('token', token)
            .single();

        if (!resetRecord || new Date(resetRecord.expires_at) < new Date()) {
            return res.render('errors/404', {
                title: 'Link Kadaluarsa'
            });
        }

        res.render('auth/reset-password', {
            title: 'Atur Ulang Password',
            token
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.render('errors/500', {
            title: 'Error',
            message: error.message
        });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, password, password_confirm } = req.body;

        if (password !== password_confirm) {
            return res.render('auth/reset-password', {
                title: 'Atur Ulang Password',
                token,
                error: 'Password tidak cocok'
            });
        }

        const { data: resetRecord } = await supabase
            .from('password_resets')
            .select('*')
            .eq('token', token)
            .single();

        if (!resetRecord || new Date(resetRecord.expires_at) < new Date()) {
            return res.render('errors/404', {
                title: 'Link Kadaluarsa'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('email', resetRecord.email);

        await supabase
            .from('password_resets')
            .delete()
            .eq('token', token);

        res.render('auth/reset-password-success', {
            title: 'Password Berhasil Diubah'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.render('auth/reset-password', {
            title: 'Atur Ulang Password',
            token: req.body.token,
            error: 'Terjadi kesalahan pada server'
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.redirect('/');
    });
});

module.exports = router;
