'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('AuthTokens', {
			id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			expires_at: {
				allowNull: true,
				type: Sequelize.DATE
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
			user_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('AuthTokens');
	}
};
