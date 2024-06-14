package com.example.roteiro01.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.Period;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(name = "Nome da tarefa")
    private String name;

    @Schema(name = "Descrição da tarefa deve possuir pelo menos 10 caracteres")
    @Size(min = 10, message = "Descrição da tarefa deve possuir pelo menos 10 caracteres")
    @Column(nullable = false)
    private String description;

    private Boolean completed;

    // Inicialização de taskType
    @Column(nullable = true)
    private Integer taskType = TaskType.DATA.ordinal();

    @FutureOrPresent(message = "A data prevista de conclusão deve ser igual ou superior à data atual")
    private LocalDate dueDate;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private int dueDays;

    @Column(nullable = true)
    private Integer priorityLevel;

    private String category; // Novo campo para categoria

    public Task(Object o, String newTask, String newDescription) {
    }

    // Métodos auxiliares
    public Integer getTaskType() {
        return taskType;
    }

    // Método auxiliar para verificar se taskType é null
    public boolean isTaskTypeNull() {
        return taskType == null;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        LocalDate currentDate = LocalDate.now();
        switch (TaskType.values()[taskType]) {
            case DATA:
                if (completed) {
                    return "Concluída";
                } else if (dueDate != null && dueDate.isBefore(currentDate)) {
                    long daysLate = Period.between(dueDate, currentDate).getDays();
                    return daysLate + " dias de atraso";
                } else {
                    return "Prevista";
                }
            case PRAZO:
                if (completed) {
                    return "Concluída";
                } else if (dueDate != null && currentDate.isAfter(dueDate.plusDays(dueDays))) {
                    long daysLate = Period.between(dueDate.plusDays(dueDays), currentDate).getDays();
                    return daysLate + " dias de atraso";
                } else {
                    return "Prevista";
                }
            case LIVRE:
                return completed ? "Concluída" : "Prevista";
            default:
                return "Tipo de tarefa inválido";
        }
    }

    @Override
    public String toString() {
        return "Task [id=" + id + ", name=" + name + ", description=" + description +
                ", completed=" + completed + ", taskType=" + taskType +
                ", priorityLevel=" + priorityLevel + ", category=" + category + "]";
    }
}
