package cn.thinkingdata.web.util;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.List;

/**
 * Created by Xiaowu on 2016/9/27.
 */
public class ExcelUtil {

    public static void genRawCsvFile(Object[] titles, List<Object[]> rowList, OutputStream outputStream) throws IOException {
        CSVFormat csvFormat = CSVFormat.EXCEL.withRecordSeparator("\n");
        OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream,"GBK");
        CSVPrinter csvPrinter = new CSVPrinter(outputStreamWriter, csvFormat);
        csvPrinter.printRecord(titles);
        for (Object[] objects : rowList) {
            csvPrinter.printRecord(objects);
        }
        csvPrinter.flush();
        csvPrinter.close();
    }



    public static void genRawExcelFile(Object[] titles, List<Object[]> rowList, OutputStream outputStream) throws IOException {
        XSSFWorkbook wb = new XSSFWorkbook();
        XSSFSheet sheet = wb.createSheet();
        Row titleRow = sheet.createRow(0);
        int[] maxColWidth = new int[titles.length];
        for(int i = 0; i < titles.length; i++){
            Cell cell = titleRow.createCell(i);
            CellStyle titleCellStyle = wb.createCellStyle();
            //设置标题行背景色
            titleCellStyle.setFillForegroundColor(IndexedColors.BRIGHT_GREEN.getIndex());
            titleCellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
            //设置标题行字体
            Font font = wb.createFont();
            font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
            titleCellStyle.setFont(font);
            //设置边框
            titleCellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
            titleCellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
            titleCellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
            titleCellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框

            cell.setCellStyle(titleCellStyle);
            cell.setCellValue(titles[i].toString());
            maxColWidth[i] = getStrWidth(titles[i].toString());
        }

        for(int i = 0; i < rowList.size(); i++){
            Row dataRow = sheet.createRow(i + 1);
            Object[] objects = rowList.get(i);
            for(int j = 0; j < objects.length; j++){
                CellStyle cellStyle = wb.createCellStyle();
//                //设置边框
//                cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
//                cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
//                cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
//                cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
                Cell cell = dataRow.createCell(j);
                cell.setCellStyle(cellStyle);
                setCellValue(wb,cell,cellStyle, objects[j]);
                int width = getStrWidth(String.valueOf(objects[j]));
                if(width > maxColWidth[j]){
                    maxColWidth[j] = width;
                }
            }
        }
        //设置自适应列宽
        for(short i = 0; i < titles.length; i++){
            sheet.setColumnWidth(i, maxColWidth[i]);
        }
        wb.write(outputStream);
        outputStream.flush();
        outputStream.close();
    }

    private static void setCellValue(Workbook wb,Cell cell,CellStyle cellStyle,Object obj){
        String typeName = obj.getClass().getSimpleName();
        if(typeName.equalsIgnoreCase("Integer") || typeName.equalsIgnoreCase("Long")){
            Long longVal = Long.parseLong(String.valueOf(obj));
            DataFormat formatDouble = wb.createDataFormat();
            cellStyle.setDataFormat(formatDouble.getFormat("#,##0"));
            cell.setCellValue(longVal);
        }else if(typeName.equalsIgnoreCase("Float") || typeName.equalsIgnoreCase("Double")){
            DataFormat formatDouble = wb.createDataFormat();
            cellStyle.setDataFormat(formatDouble.getFormat("#,##0.00"));
            cell.setCellValue((Double) obj);
        }else{
            XSSFRichTextString str = new XSSFRichTextString(String.valueOf(obj));
            cell.setCellValue(str);
        }
    }

    private static int getStrWidth(String str){
        double strwidth = 0;
        for(int i = 0; i <str.length(); i++){
            char c = str.charAt(i);
            int v = (int) c;
            if(v >= 19968 && v <= 171941){
                strwidth += 2.2 * 256;
            }else{
                strwidth += 1.1 * 256;
            }
        }
        strwidth += (str.length() / 3) * 256;
        return (int) strwidth;
    }
}
