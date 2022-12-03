'use strict';

const uuidv4 = require("uuid");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const user = await queryInterface.rawSelect('Users', {
			where: {
				email: 'harry.potter@hogwarts.uk',
			},
		}, ['id']);

		if (!user) {
			// @FIXME: see https://github.com/sequelize/sequelize/issues/10252#issuecomment-446667714
			const PASSWORD = "test123";
			const randomSalt = await bcrypt.genSalt(12);
			const passwordHash = await bcrypt.hash(PASSWORD, randomSalt);

			const userFields = [
				{
					id: uuidv4.v4(),
					first_name: 'Harry',
					middle_name: 'James',
					last_name: 'Potter',
					nickname: 'harry_potter',
					email: 'harry.potter@hogwarts.uk',
					pwd_hash: passwordHash,
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					id: uuidv4.v4(),
					first_name: 'Gandalf',
					middle_name: 'the',
					last_name: 'White',
					nickname: 'gandalf',
					email: 'gandalf.grey@shire.uk',
					pwd_hash: passwordHash,
					created_at: new Date(),
					updated_at: new Date(),
				}
			];

			await queryInterface.bulkInsert(
				'Users',
				userFields,
				{}
			);
		}
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Users', null, {});
	}
};
