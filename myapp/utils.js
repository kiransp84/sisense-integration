const {v4} = require('uuid');

module.exports = {
    uuid : () => {
        return v4();
    }
}
