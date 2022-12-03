import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
	timestamps: true,
	paranoid: true,
})
export class User extends Model {
	@Column({
		type: DataType.STRING(32),
		allowNull: false,
	})
	first_name: string;

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
	})
	last_name: string;

	@Column({
		type: DataType.STRING(256),
		allowNull: false,
		unique: true,
	})
	email: string;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
	})
	is_active: boolean;
}
