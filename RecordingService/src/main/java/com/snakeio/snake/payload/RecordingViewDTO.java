package com.snakeio.snake.payload;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecordingViewDTO {

    private String id;
    private String name;
    private String userId ;
    private String startTime;


}
