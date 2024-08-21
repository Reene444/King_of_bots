package com.snakeio.snake.config;


import com.snakeio.snake.model.Player;
import com.snakeio.snake.model.Room;
import com.snakeio.snake.service.PlayerService;
import com.snakeio.snake.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SeedData implements CommandLineRunner {


    @Autowired
    private RoomService roomService;
    @Autowired
    private PlayerService playerService;
    @Override
    public void run(String... args) throws Exception {
        Room room1= new Room("1",null,1000000,10);
        Room room2= new Room("2",null,10,10);
        Room room3= new Room("3",null,10,10);
        Room room4= new Room("4",null,10,10);
        Room room5= new Room("5",null,10,10);
        Room room6= new Room("6",null,10,10);
        Room room7= new Room("7",null,10,10);
        Room room8= new Room("8",null,10,10);
        roomService.saveRoom(room1);
        roomService.saveRoom(room2);
        roomService.saveRoom(room3);
        roomService.saveRoom(room4);
        roomService.saveRoom(room5);
        roomService.saveRoom(room6);
        roomService.saveRoom(room7);
        roomService.saveRoom(room8);
        playerService.savePlayer(new Player());
    }

}
