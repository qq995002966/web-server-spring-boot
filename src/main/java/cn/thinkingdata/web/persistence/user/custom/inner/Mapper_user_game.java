package cn.thinkingdata.web.persistence.user.custom.inner;

import java.util.List;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/25.
 */
public interface Mapper_user_game {
     List<Map> findGameByUserAndService(Map<String,Object> paramMap);

     List<Map> findGameByUser(List<Integer> gameList);

     List<Map> findGameByUserWithoutDemo(List<Integer> gameList);
}
