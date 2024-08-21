package com.snakeio.snake.service;


import com.mongodb.client.MongoCollection;
import com.snakeio.snake.model.Player;
import com.snakeio.snake.model.Room;
import com.snakeio.snake.payload.PlayerViewPayload;
import com.snakeio.snake.payload.RoomPayload;
import com.snakeio.snake.repository.PlayerRepository;
import com.snakeio.snake.repository.RoomRepository;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class RoomService {
        @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RedissonClient redissonClient;

    private volatile  ExecutorService executorService;
    public RoomService(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
        this.executorService = Executors.newFixedThreadPool(10);
    }
    public List<RoomPayload> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(room -> new RoomPayload(room.getId(), room.getPlayersCount(), room.getMaxPlayers(), room.getTimeLeft()))
                .collect(Collectors.toList());
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

    public Future<Room> addPlayerToRoom(String roomId, String playerId) {
//        Room room = getRoomById(roomId);
////        System.out.println("Room found: " + room);
//        if (room != null && room.getPlayersCount() < room.getMaxPlayers()) {
//            room.addPlayer(playerId);
//            System.out.println("Player added: " + playerId+","+getRoomById(roomId).getPlayers().size());
//            return saveRoom(room);
//        }
         final long MAX_WAIT_TIME_MS = 5000; // 最大等待时间（毫秒）
         final long LOCK_TIMEOUT_MS = 2000; // 锁持有时间（毫秒）
         final long RETRY_INTERVAL_MS = 500; // 重试间隔（毫秒）
         final Room rl=null;
        return executorService.submit(() -> {
            boolean lockAcquired = false;
            long startTime = System.currentTimeMillis();
            RLock lock = redissonClient.getLock("roomLock:" + roomId);
            Room resultRoom = null;
            while (!lockAcquired) {
                try {
                    // 尝试获取锁，最多等待 maxWaitTimeMs 毫秒，锁持有时间最多 lockTimeoutMs 毫秒
                    lockAcquired = lock.tryLock(MAX_WAIT_TIME_MS, LOCK_TIMEOUT_MS, TimeUnit.MILLISECONDS);

                    if (lockAcquired) {
                        try {
                            Room room = getRoomById(roomId);
                            if (room != null && room.getPlayersCount() < room.getMaxPlayers()) {
                                room.addPlayer(playerId);
                                resultRoom = saveRoom(room);
                            } else {
                                // 房间满员或不存在
                            }
                        } finally {
                            lock.unlock(); // 确保锁被释放
                        }
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt(); // 恢复中断状态
                    System.err.println("Thread was interrupted while trying to acquire lock.");
                }

                // 检查是否超时
//                if (System.currentTimeMillis() - startTime > MAX_WAIT_TIME_MS) {
//                  }

                    // 如果获取锁失败，等待一段时间后重试
                    try {
                        Thread.sleep(RETRY_INTERVAL_MS); // 重试间隔（毫秒）
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt(); // 恢复中断状态
                        System.err.println("Thread was interrupted while sleeping before retry.");
                    }
            }


            return resultRoom; // 返回结果
        });
    }

    public synchronized Room removePlayerFromRoom(String roomId, String playerId) {
        Room room = getRoomById(roomId);
        System.out.println("removeService remove from room");
        if (room != null) {
            System.out.println("exist player in room outcome:");
            System.out.println(room.removePlayer(playerId));
            return saveRoom(room);
        }
        return null;
    }

    public List<PlayerViewPayload> getPlayerInRoom(String roomId) {
        Room room = getRoomById(roomId);
        List<PlayerViewPayload>playerlist=new ArrayList<>();
        if(room!=null){
            Set<String> players = room.getPlayers();
            for(String  player: players){
                Optional<Player> foundPlayer= playerRepository.findById(player);
                foundPlayer.ifPresent(value -> playerlist.add(new PlayerViewPayload(value.getId(), value.getNickname(),value.getISOcode(),value.getScore())));
            }
        }
        return playerlist;
    }
}