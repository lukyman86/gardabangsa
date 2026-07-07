const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try {
        const { data: latestNews } = await supabase
            .from('news')
            .select('*')
            .eq('status', 'Published')
            .order('created_at', { ascending: false })
            .limit(3);

        const { data: gallery } = await supabase
            .from('gallery')
            .select('*')
            .eq('status', 'Published')
            .order('created_at', { ascending: false })
            .limit(6);

        res.render('public/index', {
            title: 'Beranda',
            latestNews: latestNews || [],
            gallery: gallery || []
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/profile', async (req, res) => {
    try {
        const { data: management } = await supabase
            .from('management')
            .select('*')
            .order('hierarchy_order', { ascending: true });

        const { data: programs } = await supabase
            .from('programs')
            .select('*')
            .order('target_date', { ascending: true });

        res.render('public/profile', {
            title: 'Profil Organisasi',
            management: management || [],
            programs: programs || []
        });
    } catch (error) {
        console.error('Error loading profile page:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/gallery', async (req, res) => {
    try {
        const { data: photos } = await supabase
            .from('gallery')
            .select('*')
            .eq('status', 'Published')
            .order('created_at', { ascending: false });

        res.render('public/gallery', {
            title: 'Galeri',
            photos: photos || []
        });
    } catch (error) {
        console.error('Error loading gallery page:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/news', async (req, res) => {
    try {
        const { data: articles } = await supabase
            .from('news')
            .select('*')
            .eq('status', 'Published')
            .order('created_at', { ascending: false });

        res.render('public/news', {
            title: 'Berita',
            articles: articles || []
        });
    } catch (error) {
        console.error('Error loading news page:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/news/:slug', async (req, res) => {
    try {
        const { data: article } = await supabase
            .from('news')
            .select('*')
            .eq('slug', req.params.slug)
            .eq('status', 'Published')
            .single();

        if (!article) {
            return res.status(404).render('errors/404', {
                title: 'Berita Tidak Ditemukan'
            });
        }

        const { data: related } = await supabase
            .from('news')
            .select('*')
            .eq('category', article.category)
            .eq('status', 'Published')
            .neq('id', article.id)
            .limit(3);

        res.render('public/news-detail', {
            title: article.title,
            article,
            relatedArticles: related || []
        });
    } catch (error) {
        console.error('Error loading news detail:', error);
        res.status(500).render('errors/500', { title: 'Error', message: error.message });
    }
});

router.get('/contact', (req, res) => {
    res.render('public/contact', {
        title: 'Kontak'
    });
});

router.post('/contact', async (req, res) => {
    res.json({ success: true, message: 'Terima kasih atas pesan Anda' });
});

module.exports = router;
