const checkAuth = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/auth/login?redirect=' + req.originalUrl);
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(req.session.user.role)) {
            return res.status(403).render('errors/403', {
                title: 'Akses Ditolak',
                message: 'Anda tidak memiliki wewenang untuk mengakses halaman ini'
            });
        }

        next();
    };
};

const applyGeographicScoping = (req, res, next) => {
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.role === 'operator_daerah') {
        req.userRegion = user.region;
    } else if (user.role === 'admin') {
        req.userRegion = null;
    } else {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
};

module.exports = {
    checkAuth,
    applyGeographicScoping
};
