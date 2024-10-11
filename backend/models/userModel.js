const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
	{
		name: { type: 'String', required: true },
		email: { type: 'String', required: true, unique: true },
		password: { type: 'String', required: true },
		pic: {
			type: 'String',

			default:
				'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
		},
		isAdmin: {
			type: 'Boolean',
			required: true,
			default: false,
		},	
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save',async function (next) {
	if (!this.isModified) {
        next();
	}

	try {
		const salt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, salt);
		console.log(this.password);
    } catch (error) {
        console.log(error.message);
    }
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    console.log('done')
    return bcrypt.compareSync(enteredPassword, this.password)
}
 
const User = mongoose.model('User', userSchema);
module.exports = User;
