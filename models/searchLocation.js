module.exports = function(sequelize, DataTypes) {
    var SearchLocation = sequelize.define("SearchLocation", {
        date: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // validate: {
            //     len: [8]
            // }
        },
        state: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // validate: {
            //     len: [2]
            // }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        precipitation: {
            type: DataTypes.STRING
        },
        temperature: {
            type: DataTypes.STRING
        },
        humidity: {
            type: DataTypes.STRING
        }
    });
    return SearchLocation;
};
