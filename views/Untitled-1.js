app.get('/login', async(req,res) => {
    try{
      const login = await User.find();
      console.log(login)
      res.render('login', {login:login});
    } catch (error) {
      console.error('Error fetching details:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.get('/signup', async(req,res) => {
    try{
      const signup = await User.find();
      console.log(signup)
      res.render('signup', {signup:signup});
    } catch (error) {
      console.error('Error fetching details:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });

  // Define a route to fetch users and render the view
app.get('/', async(req,res) => {
  try{
    const users = await User.find();
    console.log(users)
    res.render('users', {map4:users});
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users', async(req,res) => {
  try{
    const users = await User.find();
    console.log(users)
    res.render('users', {map4:users});
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Internal Server Error');
  }
});