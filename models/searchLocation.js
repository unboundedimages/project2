module.exports = function(sequelize, DataTypes) {
    var SearchLocation = sequelize.define("SearchLocation", {
        date00: {
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
        precipitation00: {
            type: DataTypes.STRING
        },
        temperature00: {
            type: DataTypes.STRING
        },
        humidity00: {
            type: DataTypes.STRING
        },
        date05: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        precipitation05: {
            type: DataTypes.STRING
        },
        temperature05: {
            type: DataTypes.STRING
        },
        humidity05: {
            type: DataTypes.STRING
        }
        // image: {
        //     type: DataTypes.STRING
        // }
    });
    return SearchLocation;
};
