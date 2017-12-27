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
    // image: {
    //     type: DataTypes.STRING
    // }
    SearchLocation.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        SearchLocation.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return SearchLocation;
};
