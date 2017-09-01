package cn.thinkingdata.web.service.cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

	@Autowired
	private RedisTemplate redisTemplate;

	/**
	 * 在某段时间后失效
	 * @return
	 */
	public Boolean expire(final Serializable key, final int seconds) {
		return redisTemplate.expire(key, seconds, TimeUnit.SECONDS);
	}

	public void insertKey(String key, String value, int seconds){
		redisTemplate.boundValueOps(key).set(value);
		expire(key, seconds);
	}

	public void insertKey(String key, String value){
		redisTemplate.boundValueOps(key).set(value);
	}

	public Object getValue(String key){
		return redisTemplate.boundValueOps(key).get();
	}

	public boolean isKeyExist(String key){
		return redisTemplate.hasKey(key);
	}

	public final void delAll(final String pattern) {
		redisTemplate.delete(redisTemplate.keys(pattern));
	}

}
