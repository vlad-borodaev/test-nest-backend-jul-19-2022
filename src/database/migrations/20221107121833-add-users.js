'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			first_name: {
				allowNull: false,
				type: Sequelize.STRING(512)
			},
			last_name: {
				allowNull: false,
				type: Sequelize.STRING(512)
			},
			middle_name: {
				allowNull: true,
				type: Sequelize.STRING(512)
			},
			nickname: {
				allowNull: true,
				type: Sequelize.STRING(512)
			},
			email: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING(256),
				validate: {
					isEmail: true,
					isLowercase: true,
					notNull: true,
					notEmpty: true,
				}
			},
			permission_mode: {
				allowNull: false,
				defaultValue: "User",
				type: Sequelize.ENUM("Admin", "User", "Creator")
			},
			status: {
				allowNull: false,
				defaultValue: "Active",
				type: Sequelize.ENUM("Active", "Inactive")
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	}
};
