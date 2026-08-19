package com.threatlens.backend.network.dto;

public record NetworkConnectionRequest(

        Long sourceAssetId,

        Long destinationAssetId,

        String connectionType,

        Integer port,

        String protocol,

        String status

) {
}
