package cn.thinkingdata.web.util.interceptor;

import cn.thinkingdata.web.util.ReturnCodeDim;
import com.google.common.base.Throwables;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class JudgeRuleDim {
    private static final Logger logger = LogManager.getLogger();
    private static List<JudgeRule> ruleList = new ArrayList<JudgeRule>();
    static{
        try{
            String dimPath = JudgeRuleDim.class.getResource("/").getPath() + "judge_rule_dim.txt";
            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dimPath), "UTF-8"));
            String line = "";
            int lineNum = 0;
            while((line = reader.readLine()) != null){
                lineNum++;
                if(lineNum == 1 ){
                    continue;
                }
                String tokens[] = line.split("\t");
                JudgeRule judgeRule = new JudgeRule();
                judgeRule.setTimes(Integer.parseInt(tokens[0]));
                judgeRule.setSealedGrade(Integer.parseInt(tokens[1]));
                judgeRule.setTimeSpan(Integer.parseInt(tokens[2]));
                ruleList.add(judgeRule);
            }
            reader.close();
        }catch(Exception e){
            logger.error(Throwables.getStackTraceAsString(e));
        }
    }
    public static List<JudgeRule> getRuleList(){
        return  ruleList;
    }
}


