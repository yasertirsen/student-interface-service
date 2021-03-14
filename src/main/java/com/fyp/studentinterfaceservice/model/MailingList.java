package com.fyp.studentinterfaceservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailingList {
    private Long mailingListId;
    private Long companyId;
    private List<String> emails;
}
