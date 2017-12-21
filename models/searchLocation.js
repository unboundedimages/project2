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
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });
    return SearchLocation;
};
