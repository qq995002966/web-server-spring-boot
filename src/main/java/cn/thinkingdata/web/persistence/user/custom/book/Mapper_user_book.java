package cn.thinkingdata.web.persistence.user.custom.book;

import org.apache.ibatis.annotations.Param;

import cn.thinkingdata.web.domain.book.Do_user_book;

import java.util.List;

/**
 * Created by Xiaowu on 2016/7/14.
 */
public interface Mapper_user_book {

    public int insertUserBook(Do_user_book userBook);

    public Do_user_book getBookById(Long id);

    public Do_user_book getBookByUserAndItemUnit(@Param("user_id") Long user_id, @Param("item_unit_id") Integer item_unit_id, @Param("project_list") String project_list);

    public List getBookByUserAndUnit(@Param("user_id")Long userId,@Param("item_id")Long item_id, @Param("index") Integer index, @Param("limit") Integer limit);
}
