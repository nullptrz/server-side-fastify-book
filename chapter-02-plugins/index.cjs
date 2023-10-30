const Fastify = require("fastify");

const app = Fastify({ logger: true });

app.register(async function (fastify, opts) {
  app.log.info("Registering my first plugin");
});

app.ready().then(() => app.log.info("All plugins are now registered"));
