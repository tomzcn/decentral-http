Decentral Http Entrance is an application of Decentral Http. Anyone's server can join. Together they provide an announcement service. It can be used as an entry point for other information. This is a new way to implement federation.

Different server groups can provide different channels. For example, the channel provided by the following demo server is entrance:test.tomzcn.decentral-http-entrance . The first part of the channel name is the protocol name. Yes, because the core is small, various different protocols can be created. The next three parts of the channel are similar to the name of a newsgroup.

Post an article:

```
curl -X POST http://localhost:8881/server/post \
-H 'Content-Type: application/json' \
-d '{"message": "article"," article": "an article"}'
```

