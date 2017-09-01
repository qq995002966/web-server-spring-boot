package org.springframework.data.redis.serializer;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

import java.nio.charset.Charset;

/**
 * @author Carpenter
 * @date 2016/12/27 14:38
 * @description FastJson2JsonRedisSerializer
 */
public class FastJson2JsonRedisSerializer implements RedisSerializer<Object> {

    public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");


    @Override
    public byte[] serialize(Object o) throws SerializationException {
        if (o == null) {
            return new byte[0];
        }
        return JSON.toJSONString(o, SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
    }

    @Override
    public Object deserialize(byte[] bytes) throws SerializationException {
        if (bytes == null || bytes.length <= 0) {
            return null;
        }
        String str = new String(bytes, DEFAULT_CHARSET);

        return (Object) JSON.parseObject(str, Object.class);
    }
}
