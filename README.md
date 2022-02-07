Decentral Http is a decentral application that can be installed on a url of an http server. The service will not stop as long as any node exists, regardless of whether the originating server is offline or not.

General p2p applications need to run for a long time, like emule and bittorrent, or need to be online all the time, like ipfs. This is very costly and consumes a lot of resources. And p2p applications need to run dedicated programs. Decentral Http does not need a dedicated program, just a url to the application server. Decentral Http can also run on AWS Lambda, which allows you to pay only for each call, not to run for a long time, and not to expose your server ip and domain name. Remain anonymous.

Subprojects:

https://github.com/tomzcn/decentral-http-core Very little code for a small core.

https://github.com/tomzcn/decentral-http/tree/main/subprojects/decentral-http-entrance An announcement service. And the example of server on AWS Lambda.
