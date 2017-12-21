module.exports = function(sequelize, DataTypes) {
    var SearchLocation = sequelize.define("SearchLocation", {
        date: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [8]
            }
        },
        state: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [2]
            }
        },
<<<<<<< HEAD
        results: {
            type: DataTypes.TEXT,
            allowNull: true,
            len: [1]
=======
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
>>>>>>> 6804c6e60aa62a691f2357618b32c509b9f8cde8
        }
    });
    return SearchLocation;
};
