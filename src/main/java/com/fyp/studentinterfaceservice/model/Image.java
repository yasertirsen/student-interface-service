package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Image {
    private Long imageId;
    private String name;
    private String type;
    private byte[] data;
    private Long userId;

    public Image(String name, String type, byte[] data, Long userId) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.userId = userId;
    }
}
