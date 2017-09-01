package cn.thinkingdata.web.service.core;

import cn.thinkingdata.web.domain.industry.Do_content_detail_realtime;
import cn.thinkingdata.web.domain.industry.Do_industry_trend_realtime;
import cn.thinkingdata.web.persistence.industry.Mapper_content_detail_realtime;
import cn.thinkingdata.web.persistence.industry.Mapper_industry_trend_realtime;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/16.
 */
@Service
public class HomeService {

    @Autowired
    private Mapper_content_detail_realtime mapper_content_detail_realtime;
    @Autowired
    private Mapper_industry_trend_realtime mapper_industry_trend_realtime;

    public DataResult CountryContentDetail() {
        Map<String, Object> dataMap = new LinkedHashMap<>();
        String currentDateStr = DateUtil.getMinuteDateString(new Date());
        Do_industry_trend_realtime industryTrendRealtime = mapper_industry_trend_realtime.getTrendRealtimeByDate(currentDateStr);
        if(industryTrendRealtime == null){
            return new DataResult(ReturnCodeDim.DATA_NOT_PREPARED,"");
        }
        int totalPost = industryTrendRealtime.getForum_total_post_num() + industryTrendRealtime.getChan_total_post_num() + industryTrendRealtime.getArticle_total_post_num();
        dataMap.put("total_post", totalPost);
        List<Do_content_detail_realtime> contentDetailList = mapper_content_detail_realtime.getContentDetailByDate(currentDateStr);
        if(contentDetailList == null){
            return new DataResult(ReturnCodeDim.DATA_NOT_PREPARED,"");
        }
        List<Map<String, Object>> contentMapList = new ArrayList<>();
        for(Do_content_detail_realtime contentDetail : contentDetailList){
            Map<String, Object> map = new LinkedHashMap<>();
            String content = contentDetail.getContent();
            int postType = contentDetail.getPost_type();
            Date postTime = contentDetail.getPost_time();
            String sourceId = contentDetail.getSource_id();
            String sourceName = contentDetail.getSource();
            if(postType == Do_content_detail_realtime.FORUM || postType == Do_content_detail_realtime.CHANNEL){
                content = "“" + content + "”";
            }else if(postType == Do_content_detail_realtime.ARTICLE){
                content = "《" + content + "》";
            }
            String timeStr = DateUtil.getTimeStringWithoutDate(postTime);
            String dateStr = DateUtil.getPreciseDateString(postTime);
            String imgPath = "";
            if(postType == Do_content_detail_realtime.FORUM){
                imgPath = "project/" + sourceId + ".png";
            }else if(postType == Do_content_detail_realtime.CHANNEL){
                imgPath = "project/" + sourceId + ".png";
            }else if(postType == Do_content_detail_realtime.ARTICLE){
                imgPath = "article/logo/" + sourceId + ".png";
            }
            map.put("content", content);
            map.put("image", imgPath);
            map.put("post_time", timeStr);
            map.put("post_datetime", dateStr);
            map.put("source", sourceName);
            map.put("author", contentDetail.getAuthor());
            contentMapList.add(map);
        }
        dataMap.put("content_list", contentMapList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }
}
