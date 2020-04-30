var seneca = require("seneca")();
var entities = require("seneca-entity");

seneca.quiet();
seneca.use(entities);
/*seneca.use("seneca-amqp-transport").client({
  type: "amqp",
  pin: "component: order",
  url: "amqp://guest:guest@localhost:5672"
});*/
seneca.use("mongo-store", {
  uri: 'mongodb://database:27017/cartdb'
});
seneca.use(require("./cart"));
seneca.ready(function(err) {
  console.log("server is ready!!!!");
  /* seneca.act({component:'cart',action:'add',title:'Coffehouse'}, function(err, response) {
            console.log(response.message);
      })
     seneca.act({component:'cart',action:'add',title:'Hello! Flex 4'}, function(err, response) {
        console.log(response.message);
      })
      seneca.act({component:'cart',action:'add',title:'Hello! Flex'}, function(err, response) {
        console.log(response.message);
      })
    seneca.act({component:'cart',action:'view'}, function(err, response) {
        console.log(response.books);
        seneca.close(function (err) {
            console.log('database closed!')
        })
      }); */
  seneca.listen({ port: 9111 });
});
