import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class UserModel extends Model {
	@Column({
		allowNull: false,
		primaryKey: true,
		type: DataType.STRING,
		unique: true,
	})
	declare userID: string;

	@Column({
		allowNull: false,
		defaultValue: 100,
		type: DataType.INTEGER,
	})
	declare balance: number;
}
