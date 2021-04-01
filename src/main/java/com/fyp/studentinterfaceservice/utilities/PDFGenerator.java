package com.fyp.studentinterfaceservice.utilities;

import com.fyp.studentinterfaceservice.model.*;
import com.itextpdf.text.*;
import com.itextpdf.text.List;
import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;

import java.io.ByteArrayOutputStream;

public class PDFGenerator {

    private static final Font heading = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font subheading = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font regular = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL, BaseColor.DARK_GRAY);
    private static final Font bold = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD, BaseColor.DARK_GRAY);
    private static final LineSeparator lsHeading = new LineSeparator();
    private static final LineSeparator lsPar = new LineSeparator();
    private static Logger logger = LoggerFactory.getLogger(PDFGenerator.class);

    public static byte[] generateDynamicCv(User user) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        boolean hasCourse = (user.getProfile().getCourse() != null);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            lsHeading.setOffset(10);
            lsHeading.setLineWidth(2);
            lsPar.setLineWidth(0.5f);
            lsPar.setLineColor(BaseColor.LIGHT_GRAY);

            Paragraph title = new Paragraph();
            title.setAlignment(Element.ALIGN_CENTER);
            title.add(new Chunk(user.getFirstName() + " " + user.getSurname() + "\n", heading));
            StringBuilder details = new StringBuilder();
            details.append(user.getEmail());
            if(user.getPhone() != null)
                details.append(" | ").append(user.getPhone());
            if(user.getSocialUrl() != null)
                details.append(" | ").append(user.getSocialUrl());
            title.add(new Chunk(details.toString(), regular));
            title.add(new Chunk("\n", regular));
            title.add(lsPar);
            document.add(title);

            if(user.getProfile().getBio() != null) {
                document.add(createHeading("Summary"));
                Paragraph summaryContent = initializeContent();
                summaryContent.add(new Chunk(user.getProfile().getBio() + "\n", regular));
                summaryContent.add(lsPar);
                document.add(summaryContent);
            }

            if(hasCourse) {
                document.add(createHeading("Education"));
                Paragraph educationContent = initializeContent();
                educationContent.add(new Chunk(user.getProfile().getCourse().getName() + "\n", bold));
                educationContent.add(new Chunk(user.getProfile().getStartCourse() + " - "
                        + user.getProfile().getEndCourse() + "\n", bold));
                educationContent.add(new Chunk(user.getProfile().getCourse().getUniversity() + "\n", regular));
                if(user.getProfile().getAverageGrade() != 0)
                    educationContent.add(new Chunk("Average Grade: " + user.getProfile().getAverageGrade() + "\n", regular));
                educationContent.add(lsPar);
                document.add(educationContent);
            }

            if (!user.getProfile().getProjects().isEmpty()) {
                document.add(createHeading("Projects"));
                Paragraph projectsContent = initializeContent();
                for (Project project : user.getProfile().getProjects()) {
                    projectsContent.add(new Chunk(project.getTitle() + "\n", subheading));
                    if(project.getDate() != null)
                        projectsContent.add(new Chunk(project.getDate() + "\n", subheading));
                    projectsContent.add(new Chunk(project.getDescription() + "\n", regular));
                }
                projectsContent.add(lsPar);
                document.add(projectsContent);
            }

            if(!user.getProfile().getExperiences().isEmpty()) {
                document.add(createHeading("Experience"));
                Paragraph experienceContent = initializeContent();
                for(Experience experience : user.getProfile().getExperiences()) {
                    experienceContent.add(new Chunk(experience.getRole() + "\n", subheading));
                    experienceContent.add(new Chunk(experience.getCompany() + "\n", subheading));
                    experienceContent.add(new Chunk(experience.getBegin() + " - "
                            + experience.getEnd() + "\n", subheading));
                    if(experience.isVoluntary()) {
                        experienceContent.add(new Chunk("Volunteer\n", subheading));
                    }
                    experienceContent.add(new Chunk(experience.getDescription() + "\n", regular));
                }
                experienceContent.add(lsPar);
                document.add(experienceContent);
            }

            if(!user.getProfile().getExternalSkills().isEmpty()) {
                document.add(createHeading("Skills"));
                Paragraph skillsContent = initializeContent();
                List skillsList = new List();
                for (Skill skill : user.getProfile().getExternalSkills()) {
                    skillsList.add(new ListItem(skill.getSkillName(), regular));
                }
                skillsContent.add(skillsList);
                skillsContent.add(lsPar);
                document.add(skillsContent);
        }

            if(hasCourse && !user.getProfile().getCourse().getModules().isEmpty()) {
                document.add(createHeading("Modules"));
                Paragraph modulesContent = initializeContent();
                List modulesList = new List();
                for(Module module : user.getProfile().getCourse().getModules()) {
                    modulesList.add(new ListItem(module.getName(), regular));
                }
                modulesContent.add(modulesList);
                modulesContent.add(lsPar);
                document.add(modulesContent);
        }
            document.close();
        }catch(DocumentException e) {
            logger.error(e.toString());
        }

        return out.toByteArray();
    }

    private static Paragraph initializeContent() {
        Paragraph paragraph = new Paragraph();
        paragraph.setSpacingBefore(8);
        return paragraph;
    }

    private static Paragraph createHeading(String title) {
        Paragraph paragraph = new Paragraph();
        paragraph.setSpacingBefore(20);
        paragraph.add(new Chunk(title + "\n", heading));
        paragraph.add(lsHeading);
        return paragraph;
    }
}
