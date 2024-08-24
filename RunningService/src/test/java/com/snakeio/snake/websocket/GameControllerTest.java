package com.snakeio.snake.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.snakeio.snake.model.Player;
import com.snakeio.snake.payload.PlayerMovePayload;
import com.snakeio.snake.service.GameService;
import com.snakeio.snake.service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GameControllerTest {

    @Mock
    private GameService gameService;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private GameController gameController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper; // 用于将对象转换为JSON

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(gameController).build();
        objectMapper = new ObjectMapper(); // 初始化ObjectMapper
    }

    @Test
    void addPlayer() throws Exception {
        Player player = new Player();
        player.setId("player1");
        player.setNickname("Test Player");

        mockMvc.perform(post("/game/testRoom/add")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(player))) // 转换Player对象为JSON
                .andExpect(status().isOk());

        verify(gameService).addPlayerToRoom(eq("testRoom"), any(Player.class));
        verify(roomService).addPlayerToRoom(eq("testRoom"), eq("player1"));
    }

    @Test
    void movePlayer() throws Exception {
//        PlayerMovePayload movePayload = new PlayerMovePayload();
//        movePayload.setId("player1");
//        Player.Segment segment = new Player.Segment();
//        segment.setX(10);
//        segment.setY(20);
//        movePayload.setHead(segment);
//        movePayload.setTimestamp(123456789L);
//
//        mockMvc.perform(post("/game/testRoom/move")
//                        .contentType("application/json")
//                        .content(objectMapper.writeValueAsString(movePayload))) // 转换PlayerMovePayload对象为JSON
//                .andExpect(status().isOk());
//
//        verify(gameService).movePlayer(eq("testRoom"), any(PlayerMovePayload.class));
    }

    @Test
    void removePlayer() throws Exception {
        Player player = new Player();
        player.setId("player1");
        player.setNickname("Test Player");

        mockMvc.perform(post("/game/testRoom/removePlayer")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(player))) // 转换Player对象为JSON
                .andExpect(status().isOk());

        verify(gameService).removePlayerFromRoom(eq("testRoom"), any(Player.class));
        verify(roomService).removePlayerFromRoom(eq("testRoom"), eq("player1"));
    }
}
