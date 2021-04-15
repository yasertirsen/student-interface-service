package com.fyp.studentinterfaceservice.services;

import com.fyp.studentinterfaceservice.model.NotificationEmail;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@AllArgsConstructor
public class MailContentBuilder {

    private final TemplateEngine templateEngine;

    public String build(NotificationEmail notificationEmail) {
        Context context = new Context();
        context.setVariable("message", notificationEmail.getBody());
        context.setVariable("link", notificationEmail.getLink());
        return templateEngine.process("emailTemplate", context);
    }
}
