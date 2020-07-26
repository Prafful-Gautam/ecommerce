users = [];
 function insert(user) {
  //make mongoose db call to save user in db

  users.push(user);
  console.log('save user in db', users);
  return users;
}

module.exports = {insert};
