var model = require('../model'),
	user = model.user,
	moment = require('moment'),
	Duoshuo = require('duoshuo');

// list users
exports.ls = function(cb){
	user.find({}).exec(function(err,us){
		if (!err) {
			cb(us)
		} else {
			cb('error');
		}
	});
}

// count users
exports.count = function(cb){
	user.count({},function(err,count){
		if (!err) {
			cb(count)
		} else {
			cb('error');
		}
	});
}

// 读取一个用户
exports.read = function(id,cb){
	user.findById(id).populate('threads').exec(function(err,user){
		if (!err) {
			cb(user)
		} else {
			cb('error')
		}
	});
}

// queryById
exports.queryById = function(id,cb){
	user.findById(id).exec(function(err,user){
		if (!err) {
			cb(user)
		} else {
			cb('error')
		}
	});
}

// 读取一个用户by user_id
exports.readByDsId = function(id,cb){
	user.findOne({
		'duoshuo.user_id' : id
	}).exec(function(err,user){
		if (!err) {
			cb(user)
		} else {
			cb('error')
		}
	});
}

// 创建用户
exports.create = function(baby,cb) {
	var baby = new user(baby);
	baby.save(function(err){
		if (!err) {
			cb(baby);
		} else {
			console.log(err)
		}
	})
}

// 同步一个用户到多说
exports.sync = function(config,user,cb) {
	var duoshuo = new Duoshuo(config);
	var typeMap = {
		admin: 'administrator',
		editor: 'editor',
		author: 'author',
		normal: 'user'
	};
	// sync user info
	duoshuo.join({
	    info: {
	        user_key: user._id,
	        name: user.nickname,
	        role: typeMap[user.type],
	        avatar_url: user.avatar,
	        url: user.url,
	        created_at: moment(user.created).format('YYYY-MM-DD hh:MM:ss')
	    },
	    access_token: user.duoshuo.access_token
	},function(result){
		cb(result);
	});
}

// 更新用户
exports.update = function(id,body,cb) {
	user.findByIdAndUpdate(id,body,function(err){
		if (!err) {
			cb(body);
		}
	})
}

// 删除用户
exports.remove = function(id) {
	user.findById(id).exec(function(err,u){
		if (!err) {
			u.remove();
			u.save();
		}
	})
}