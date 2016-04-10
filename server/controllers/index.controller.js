
exports.render = function(req, res) {

    res.sendFile('app/index.html', {root: './client'});
};