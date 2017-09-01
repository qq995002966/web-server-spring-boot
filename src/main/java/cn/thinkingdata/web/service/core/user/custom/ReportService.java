package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.web.domain.book.Do_user_book;
import cn.thinkingdata.web.domain.order.Do_item;
import cn.thinkingdata.web.domain.order.Do_item_unit;
import cn.thinkingdata.web.domain.report.Do_report;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.custom.Do_user_custom_service;
import cn.thinkingdata.web.persistence.order.Mapper_item;
import cn.thinkingdata.web.persistence.order.Mapper_item_unit;
import cn.thinkingdata.web.persistence.report.Mapper_report;
import cn.thinkingdata.web.persistence.user.custom.Mapper_user_custom_service;
import cn.thinkingdata.web.persistence.user.custom.book.Mapper_user_book;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.StringUtil;
import cn.thinkingdata.web.util.WebUtil;
import cn.thinkingdata.web.util.qcloud.AliyunApiUtil;
import cn.thinkingdata.web.util.qcloud.QcloudApiUtil;

import com.aliyuncs.exceptions.ClientException;
import com.qcloud.cos.exception.AbstractCosException;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.*;

/**
 * Created by Xiaowu on 2016/7/6.
 */
@Service
public class ReportService {

	@Autowired
	private Mapper_user_custom_service mapper_user_custom_service;

	@Autowired
	private Mapper_user_book mapper_user_book;

	@Autowired
	private Mapper_item mapper_item;

	@Autowired
	private Mapper_item_unit mapper_item_unit;

	@Autowired
	private Mapper_report mapper_report;

	private static final int SERVICE_TYPE_REPORT_OUTFLOW = 7;

	public DataResult getReportList() {
		List<Do_item> reportList = mapper_item.getReportList();
		DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, reportList);
		return dataResult;
	}

	public DataResult getUserReportListByItem(Integer itemId) {
		Integer user_id = WebUtil.getCurrentUser().getUser_id();
		List<Do_report> reportList = mapper_report.findByUserAndItem(user_id,itemId);
        if(reportList.size()<1){
            reportList = mapper_report.findByUserAndItemDemo(itemId);
        }
		return new DataResult(ReturnCodeDim.SUCCESS,reportList);
	}

	public DataResult getUserReportListByClassify(Integer classifyId) {
		Integer user_id = WebUtil.getCurrentUser().getUser_id();
		List<Do_report> reportList = mapper_report.findByUserAndClassify(user_id,classifyId);
		String type = "report";
		if(reportList.size()<1){
			reportList = mapper_report.findByUserAndClassifyDemo(classifyId);
			type = "demo";
		}
		Map<String,Object> resultMap = new HashMap<>();
		resultMap.put("data",reportList);
		resultMap.put("type",type);
		return new DataResult(ReturnCodeDim.SUCCESS,resultMap);
	}

	public DataResult getUserReportList(Integer user_id) {
		List<Do_report> reportList = mapper_report.getUserReportList(user_id);
		List<Map<String,Object>> resultList = new ArrayList<>();
		for(Do_report report : reportList){
			Map<String, Object> dataMap = new HashMap<>();
			dataMap.put("report_id",report.getReport_id());
			dataMap.put("report_name",report.getReport_name());
			dataMap.put("report_desc",report.getReport_desc());
			dataMap.put("report_slogan",report.getReport_slogan());
			dataMap.put("cover_pic", report.getCover_pic());
			resultList.add(dataMap);
		}
		return new DataResult(ReturnCodeDim.SUCCESS, resultList);
	}

	public DataResult GetBookList(Long itemId, Integer index, Integer limit) {
		List bookList = mapper_user_book.getBookByUserAndUnit(WebUtil.getCurrentUser().getUser_id().longValue(),itemId,index,limit);
		return new DataResult(ReturnCodeDim.SUCCESS, bookList);
	}

	public DataResult CreateBook(Integer itemUnitId, Integer projectNum, String projectList, String companyName, String companyAddress, String contactName, String contactType) {
		Do_user m_login_user = WebUtil.getCurrentUser();
		long userId = m_login_user.getUser_id().longValue();
		String bookId = StringUtil.genOrderId(userId);
		Do_item_unit do_item_unit = null;
		if(itemUnitId == null){
			return new DataResult(ReturnCodeDim.ITEM_NONEXIST,"");
		}else {
			do_item_unit = mapper_item_unit.getItemUnitByItemUnitId(itemUnitId);
			if(do_item_unit == null){
				return new DataResult(ReturnCodeDim.ITEM_NONEXIST,"");
			}
			if(do_item_unit.getItem_unit() != 3){
				return new DataResult(ReturnCodeDim.ITEM_CANT_BOOKED,"");
			}
		}
		Do_user_book userBook = null;
		userBook = mapper_user_book.getBookByUserAndItemUnit(userId,itemUnitId,projectList);
		if(userBook!=null){
			return new DataResult(ReturnCodeDim.ITEM_HAD_BOOKED,"");
		}
		userBook = new Do_user_book();
		if( do_item_unit.getItem_unit() == 10){
			userBook.setStatus(2);
		}
		userBook.setUser_id(userId);
		userBook.setBook_id(bookId);
		userBook.setItem_unit_id(do_item_unit.getItem_unit_id().longValue());
		userBook.setProject_num(projectNum);
		userBook.setProject_list(projectList);
		userBook.setStatus(1);
		userBook.setCompany_name(companyName);
		userBook.setCompany_address(companyAddress);
		userBook.setContact_name(contactName);
		userBook.setContact_type(contactType);
		mapper_user_book.insertUserBook(userBook);
		userBook = mapper_user_book.getBookById(userBook.getId());
		return new DataResult(ReturnCodeDim.SUCCESS,userBook);
	}

	public DataResult ReadReport(Integer reportId) throws AbstractCosException, UnsupportedEncodingException, ClientException {
		DataResult dataResult = checkCustomServiceReport(reportId);
		if(dataResult != null){
			return dataResult;
		}
		Do_report report = mapper_report.get(reportId);
		String filePath = report.getReport_path();
		String url = AliyunApiUtil.getReportPdfAccessUrl(filePath, 30);
		Map<String,Object> result = new HashMap<>();
		result.put("data",url);
		dataResult = new DataResult(ReturnCodeDim.SUCCESS,result);
		return dataResult;
	}

	private DataResult checkCustomServiceReport(Integer reportId){
		if(0 == reportId){
			return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"reportId不能为空");
		}
		Do_report report = mapper_report.get(reportId);
		if(Do_report.DEMO_STATU == report.getStatus()){
			return null;
		}
		Do_user userDo = WebUtil.getCurrentUser();
		Do_user_custom_service userCustomService = mapper_user_custom_service.getCustomServiceByUserAndTypeAndProject(userDo.getUser_id(), SERVICE_TYPE_REPORT_OUTFLOW, 0,reportId);
		if (userCustomService == null) {
			return new DataResult(ReturnCodeDim.REPORT_NOT_BUY,"");
		}
		return null;
	}
}
