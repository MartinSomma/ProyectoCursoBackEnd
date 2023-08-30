export const handlePolicies = policies => (req, res, next) => {
    const profile = req.user?.profile || null
    
    if (policies.includes(profile)) return next()
    res.status(404).json({status: 'error', message: 'No autorizado'})
}