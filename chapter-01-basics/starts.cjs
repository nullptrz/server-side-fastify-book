const fastify = require("fastify");
const serverOptions = {
  logger: {
    level: "debug",
    transport: {
      target: "pino-pretty",
    },
  },
};
const app = fastify(serverOptions);

app.register(
  function myPlugin(pluginInstance, opts, next) {
    pluginInstance.log.info("I am a plugin instance");
    pluginInstance.log.info(opts);
    next();
  },
  { hello: "the opts object" }
);

app.addHook("onRoute", function inspector(routeOptions) {
  console.log(routeOptions);
});
app.addHook("onRegister", function inspector(plugin, pluginOptions) {
  console.log("Chapter 2, Plugin System and Boot Process");
});
app.addHook("onReady", function preLoading(done) {
  console.log("onReady");
  done();
});
app.addHook("onClose", function manageClose(done) {
  console.log("onClose");
  done();
});

function business(request, reply) {
  reply.send({ helloFrom: this.server.address() });
}
app.get("/server", business);

const cats = [];
app.post("/cat", function saveCat(request, reply) {
  cats.push(request.body);
  reply.code(201).send({ allCats: cats });
});

app.route({
  url: "/hello",
  method: "GET",
  handler: function myHandler(request, reply) {
    reply.send("world");
  },
});

app
  .listen({
    port: 3000,
    host: "0.0.0.0",
  })
  .then((address) => {
    app.log.debug(app.initialConfig, "Fastify listening with the config");
    const { port } = app.server.address();
    app.log.info("HTTP Server port is %i", port);
  });
