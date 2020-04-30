var pid = 1;

module.exports = function cart(options) {
  this.add({ component: "cart", action: "add" }, function(args, respond) {
    var cart = this.make$("cart");
    cart.list$({ username: args.username }, function(error, entity) {
      if (error) return respond(error);
      if (entity.length == 0) {
        console.log("new cart");
        (cart.username = args.username), (cart.items = [args.title]);

        cart.save$(function(error, book) {
          if (error) return respond(error);

          respond(null, { message: "Added to cart" });
        });
      } else {
        if (entity[0].items.includes(args.title))
          respond(null, { message: "Book already in cart" });
        else {
          entity[0].items.push(args.title);
          entity[0].save$(function(error, book) {
            if (error) return respond(error);
            respond(null, { message: "updated the cart" });
          });
        }
      }
    });
  });

  this.add({ component: "cart", action: "view" }, function(args, respond) {
    this.client({ host: "account-service", port: 9777 }).act(
      {
        component: "account",
        action: "authorize",
        user: args.user
      },
      function(error, response) {
        console.log("cart view called " + response.status);
        var cart = this.make$("cart");
        if (error) {
          return respond(error, false);
        }
        if (response.status) {
          cart.list$({}, function(err, list) {
            respond(null, { books: list });
          });
        } else {
          cart.list$({ username: args.user }, function(err, list) {
            respond(null, { books: list });
          });
        }
      }
    );
    /* var cart = this.make$("cart");
    //console.log("Role = " + args.role);
    if (args.role == "admin") {
      cart.list$({}, function(err, list) {
        respond(null, { books: list });
      });
    } else
      cart.list$({ username: args.username }, function(err, list) {
        respond(null, { books: list });
      }); */
  });

  this.add({ component: "cart", action: "remove" }, function(args, respond) {
    var cart = this.make$("cart");
    cart.list$({ username: args.username }, function(error, entity) {
      if (error) return respond(error);
      if (entity.length == 0) {
        respond(null, { message: "empty cart" });
      } else if (!entity[0].items.includes(args.title))
        respond(null, { message: "Book doesnot exist in the cart" });
      else {
        entity[0].items = entity[0].items.filter(item => item != args.title);
        entity[0].save$(function(error, book) {
          if (error) return respond(error);

          respond(null, { message: "removed from cart" });
        });
      }
    });
  });

  this.add({ component: "cart", action: "checkout" }, function(args, respond) {
    console.log("Username " + args.username);
    this.act(
      "component: order, action:checkout",
      { username: args.username },
      (err, res) => {
        if (err) throw err;
        respond(err, {
          message: "Order taken! Order Id for your reference : " + res.orderid
        });
      }
    );
  });
};
