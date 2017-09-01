package cn.thinkingdata.web.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import java.io.Serializable;
import java.util.concurrent.TimeUnit;

public final class RedisUtil {

	private RedisUtil() {}

	private static RedisTemplate<Serializable, Serializable> redisTemplate = null;
	//这里需要注意一下，老项目中这里使用的事 redis.expiration作为过期时间
	private static Integer EXPIRE = PropertiesUtil.getInt("redis.expiration");

	// 获取连接
	private static RedisTemplate<Serializable, Serializable> getRedis() {
		if (redisTemplate == null) {
			synchronized (RedisUtil.class) {
				if (redisTemplate == null) {
					WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();
					redisTemplate = (RedisTemplate<Serializable, Serializable>)wac.getBean("redisTemplate");
				}
			}
		}
		return redisTemplate;
	}

	/**
	 * 在某段时间后失效
	 * @return
	 */
	public static final Boolean expire(final Serializable key, final int seconds) {
		return getRedis().expire(key, seconds, TimeUnit.SECONDS);
	}

	public static void insertKey(String key, String value, int seconds){
		getRedis().boundValueOps(key).set(value);
		expire(key, seconds);
	}

	public static void insertKey(String key, String value){
		getRedis().boundValueOps(key).set(value);
		expire(key, EXPIRE);
	}

	public static Serializable getValue(String key){
		return getRedis().boundValueOps(key).get();
	}

	public static boolean isKeyExist(String key){
		return getRedis().hasKey(key);
	}

	public static final void delAll(final String pattern) {
		getRedis().delete(getRedis().keys(pattern));
	}

}
