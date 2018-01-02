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
            type: DataTypes.STRING,
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
        conds05: {
            type: DataTypes.STRING
        },
        highTemp05: {
            type: DataTypes.STRING
        },
        lowTemp05: {
            type: DataTypes.STRING
        },
        hum05: {
            type: DataTypes.STRING
        },
        conds10: {
            type: DataTypes.STRING
        },
        highTemp10: {
            type: DataTypes.STRING
        },
        lowTemp10: {
            type: DataTypes.STRING
        },
        hum10: {
            type: DataTypes.STRING
        },
        conds15: {
            type: DataTypes.STRING
        },
        highTemp15: {
            type: DataTypes.STRING
        },
        lowTemp15: {
            type: DataTypes.STRING
        },
        hum15: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        todayDate: {
            type: DataTypes.STRING
        },
        todayHigh: {
            type: DataTypes.STRING
        },
        todayLow: {
            type: DataTypes.STRING
        },
        todayConds: {
            type: DataTypes.STRING
        },
        monthFormat: {
            type: DataTypes.STRING
        },
        dayFormat: {
            type: DataTypes.STRING
        }
    });
    SearchLocation.associate = function(models) {
        SearchLocation.belongsTo(models.user, {
            // foreignKey: 'userId'
        });
    };
    return SearchLocation;
};
