package com.fyp.studentinterfaceservice.utilities;

import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.model.Project;
import com.fyp.studentinterfaceservice.model.User;
import com.itextpdf.text.*;
import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

public class PDFGenerator {

    private static Logger logger = LoggerFactory.getLogger(PDFGenerator.class);

    public static byte[] generateDynamicCv(ArrayList<String> skills, User user) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(document, out);
            document.open();

            Font heading = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.BOLD, BaseColor.DARK_GRAY);
            Font subheading = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD, BaseColor.DARK_GRAY);
            Font regular = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL, BaseColor.DARK_GRAY);
            Font bold = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD, BaseColor.DARK_GRAY);
            LineSeparator lsHeading = new LineSeparator();
            LineSeparator lsPar = new LineSeparator();
            lsHeading.setOffset(10);
            lsHeading.setLineWidth(2);
            lsPar.setLineWidth(0.5f);
            lsPar.setLineColor(BaseColor.LIGHT_GRAY);

            Paragraph title = new Paragraph();
            title.setAlignment(Element.ALIGN_CENTER);
            title.add(new Chunk(user.getFirstName() + " " + user.getSurname() + "\n", heading));
            title.add(new Chunk("Email: " + user.getEmail() + "\n", regular));
            title.add(new Chunk("Phone: " + user.getPhone() + "\n", regular));
            title.add(lsPar);
            document.add(title);

            Paragraph summary = new Paragraph("Summary\n", heading);
            summary.setSpacingBefore(20);
            summary.add(lsHeading);
            document.add(summary);
            Paragraph summaryContent = new Paragraph();
            summaryContent.setSpacingBefore(8);
            summaryContent.add(new Chunk(user.getProfile().getBio() + "\n", regular));
            summaryContent.add(lsPar);
            document.add(summaryContent);

            Paragraph education = new Paragraph("Education\n", heading);
            education.setSpacingBefore(20);
            education.add(lsHeading);
            document.add(education);
            Paragraph educationContent = new Paragraph();
            educationContent.setSpacingBefore(8);
            educationContent.add(new Chunk(user.getProfile().getCourse().getName() + "\n", bold));
            educationContent.add(new Chunk(user.getProfile().getCourse().getUniversity() + "\n", regular));
            educationContent.add(lsPar);
            document.add(educationContent);

            if(user.getProfile().getProjects() != null) {
                Paragraph projects = new Paragraph();
                projects.setSpacingBefore(20);
                projects.add(new Chunk("Projects\n", heading));
                projects.add(lsHeading);
                document.add(projects);
                Paragraph projectsContent = new Paragraph();
                projectsContent.setSpacingBefore(8);
                for(Project project : user.getProfile().getProjects()) {
                    projectsContent.add(new Chunk(project .getTitle() + "\n", subheading));
                    projectsContent.add(new Chunk(project .getDescription() + "\n", regular));
                }
                projectsContent.add(lsPar);
                document.add(projectsContent);
            }

            Paragraph skillsPar = new Paragraph();
            skillsPar.setSpacingBefore(20);
            skillsPar.add(new Chunk("Skills\n", heading));
            skillsPar.add(lsHeading);
            document.add(skillsPar);
            Paragraph skillsContent = new Paragraph();
            skillsContent.setSpacingBefore(8);
            List skillsList = new List();
            if(!skills.isEmpty()) {
                for(String skill: skills) {
                    skillsList.add(new ListItem(skill, regular));
                }
            }
            skillsContent.add(skillsList);
            skillsPar.add(lsPar);
            document.add(skillsContent);

            document.close();
        }catch(DocumentException e) {
            logger.error(e.toString());
        }

        return out.toByteArray();
    }
}
