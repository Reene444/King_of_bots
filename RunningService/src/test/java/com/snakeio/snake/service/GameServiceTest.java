package com.snakeio.snake.service;

import com.snakeio.snake.model.Player;
import com.snakeio.snake.payload.PlayerMovePayload;
import com.snakeio.snake.service.GameService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class GameServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ListOperations<String, Object> listOps;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private GameService gameService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(redisTemplate.opsForList()).thenReturn(listOps);
    }

    @Test
    void movePlayer() {
        // Given
//        String roomId = "room1";
//        Player player = new Player();
//        player.setId("player1");
//        player.setSegments(new ArrayList<>());
//        player.setLastUpdateTime(0L);
//
//        PlayerMovePayload movePayload = new PlayerMovePayload();
//        movePayload.setId("player1");
//        movePayload.setHead(new Player.Segment());
//        movePayload.setTimestamp(1L);
//
//        List<Player> playersInRoom = new ArrayList<>();
//        playersInRoom.add(player);
//
//        // Mock the list operations
//        when(listOps.range(anyString(), anyInt(), anyInt())).thenReturn(Collections.singletonList(playersInRoom));
//
//        // Find the index of the player manually for testing
//        int playerIndex = 0; // Since we know it's the only player in the list
//
//        // Mock the behavior of ListOperations to return the player index
//        when(listOps.index(anyString(), anyInt())).thenAnswer(invocation -> {
//            int index = invocation.getArgument(1);
//            if (index == playerIndex) {
//                return player;
//            }
//            return null;
//        });

        // When
//        gameService.movePlayer(roomId, movePayload);

        // Then
//        verify(listOps, times(1)).set(anyString(), eq(playerIndex), any(Player.class));
//        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/game/" + roomId + "/move"), any(PlayerMovePayload.class));
    }
}
