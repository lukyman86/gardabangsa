const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { checkAuth } = require('../middleware/auth');
const slugify = require('slugify');

router.get('/dashboard', checkAuth(['admin', 'operator_daerah']), async (req, res) => {
    try {
        const user = req.session.user;

        let membersQuery = supabase.from('users').select('id', { count: 'exact' });
        let newsQuery = supabase.from('news').select('id', { count: 'exact' });
        let galleryQuery = supabase.from('gallery').select('id', { count: 'exact' });

        if (user.role === 'operator_daerah') {
            membersQuery = membersQuery.eq('region', user.region);
            newsQuery = newsQuery.eq('region', user.region);
            galleryQuery = galleryQuery.eq('region', user.region);
        }

        const [members, news, gallery] = await Promise.all([
            membersQuery,
            newsQuery,
            galleryQuery
        ]);

        res.render('admin/dashboard', {
            title: 'Dashboard Admin',
            stats: {
                members: members.count || 0,
                news: news.count || 0,
                gallery: gallery.count || 0
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/members', checkAuth(['admin', 'operator_daerah']), async (req, res) => {
    try {
        const user = req.session.user;
        let query = supabase.from('users').select('*').order('created_at', { ascending: false });

        if (user.role === 'operator_daerah') {
            query = query.eq('region', user.region);
        }

        const { data: members, error } = await query;

        if (error) throw error;

        res.render('admin/members', {
            title: 'Manajemen Anggota',
            members: members || []
        });
    } catch (error) {
        console.error('Members error:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/members/create', checkAuth(['admin', 'operator_daerah']), (req, res) => {
    res.render('admin/members-create', {
        title: 'Tambah Anggota'
    });
});

router.post('/members/create', checkAuth(['admin', 'operator_daerah']), async (req, res) => {
    try {
        const operator = req.session.user;
        const { name, email, password, role, region } = req.body;

        if (!name || !email || !password) {
            return res.render('admin/members-create', {
                title: 'Tambah Anggota',
                error: 'Nama, email, dan password harus diisi'
            });
        }

        const finalRegion = operator.role === 'admin' ? region : operator.region;
        const hashedPassword = await bcrypt.hash(password, 10);

        const { error } = await supabase.from('users').insert([{
            name,
            email,
            password: hashedPassword,
            role: role || 'anggota',
            region: finalRegion
        }]);

        if (error) {
            return res.render('admin/members-create', {
                title: 'Tambah Anggota',
                error: error.message
            });
        }

        res.redirect('/admin/members?success=Anggota berhasil ditambahkan');
    } catch (error) {
        console.error('Create member error:', error);
        res.render('admin/members-create', {
            title: 'Tambah Anggota',
            error: 'Terjadi kesalahan pada server'
        });
    }
});

router.get('/news', checkAuth(['admin', 'operator_daerah']), async (req, res) => {
    try {
        const user = req.session.user;
        let query = supabase.from('news').select('*').order('created_at', { ascending: false });

        if (user.role === 'operator_daerah') {
            query = query.eq('region', user.region);
        }

        const { data: newsItems, error } = await query;

        if (error) throw error;

        res.render('admin/news-cms', {
            title: 'Manajemen Berita',
            newsItems: newsItems || []
        });
    } catch (error) {
        console.error('News error:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/news/create', checkAuth(['admin', 'operator_daerah']), (req, res) => {
    res.render('admin/news-create', {
        title: 'Buat Berita Baru'
    });
});

router.post('/news/create', checkAuth(['admin', 'operator_daerah']), async (req, res) => {
    try {
        const user = req.session.user;
        const { title, content, category, image_url } = req.body;

        if (!title || !content) {
            return res.render('admin/news-create', {
                title: 'Buat Berita Baru',
                error: 'Judul dan konten harus diisi'
            });
        }

        const slug = slugify(title, { lower: true, strict: true });

        const { error } = await supabase.from('news').insert([{
            title,
            slug,
            content,
            category,
            image_url,
            author: user.id,
            region: user.region,
            status: user.role === 'admin' ? 'Published' : 'Pending Review'
        }]);

        if (error) throw error;

        res.redirect('/admin/news?success=Berita berhasil dibuat');
    } catch (error) {
        console.error('Create news error:', error);
        res.render('admin/news-create', {
            title: 'Buat Berita Baru',
            error: 'Terjadi kesalahan pada server'
        });
    }
});

router.get('/gallery', checkAuth(['admin', 'operator_daerah']), async (req, res) => {
    try {
        const user = req.session.user;
        let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });

        if (user.role === 'operator_daerah') {
            query = query.eq('region', user.region);
        }

        const { data: galleryItems, error } = await query;

        if (error) throw error;

        res.render('admin/gallery-cms', {
            title: 'Manajemen Galeri',
            galleryItems: galleryItems || []
        });
    } catch (error) {
        console.error('Gallery error:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/gallery/create', checkAuth(['admin', 'operator_daerah']), (req, res) => {
    res.render('admin/gallery-create', {
        title: 'Unggah Foto Baru'
    });
});

router.post('/gallery/create', checkAuth(['admin', 'operator_daerah']), async (req, res) => {
    try {
        const user = req.session.user;
        const { title, description, image_url } = req.body;

        if (!title || !image_url) {
            return res.render('admin/gallery-create', {
                title: 'Unggah Foto Baru',
                error: 'Judul dan URL foto harus diisi'
            });
        }

        const { error } = await supabase.from('gallery').insert([{
            title,
            description,
            image_url,
            uploaded_by: user.id,
            region: user.region,
            status: user.role === 'admin' ? 'Published' : 'Pending Review'
        }]);

        if (error) throw error;

        res.redirect('/admin/gallery?success=Foto berhasil diunggah');
    } catch (error) {
        console.error('Create gallery error:', error);
        res.render('admin/gallery-create', {
            title: 'Unggah Foto Baru',
            error: 'Terjadi kesalahan pada server'
        });
    }
});

module.exports = router;
