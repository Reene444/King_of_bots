# 进入 Kafka 容器
docker exec -it kafka /bin/bash

# 创建主题
/opt/kafka/bin/kafka-topics.sh --create --topic player-add --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1

./kafka-topics.sh --create --topic player-move --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
/opt/kafka/bin/kafka-topics.sh --create --topic player-remove --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1


git clone https://github.com/yahoo/kafka-manager.git
cd kafka-manager


sbt clean dist


cd target/universal
unzip kafka-manager-*.zip
cd kafka-manager-*

kafka-manager.zkhosts="localhost:2182"


bin/kafka-manager
