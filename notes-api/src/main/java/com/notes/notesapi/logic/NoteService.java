package com.notes.service;

import com.notes.dto.NoteRequest;
import com.notes.dto.NoteResponse;
import com.notes.entity.Note;
import com.notes.entity.User;
import com.notes.repository.NoteRepository;
import com.notes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private NoteResponse mapToResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getUser().getId(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes() {
        User user = getCurrentUser();
        return noteRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long id) {
        User user = getCurrentUser();
        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Note not found or access denied"));
        return mapToResponse(note);
    }

    @Transactional
    public NoteResponse createNote(NoteRequest request) {
        User user = getCurrentUser();

        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setUser(user);

        note = noteRepository.save(note);
        return mapToResponse(note);
    }

    @Transactional
    public NoteResponse updateNote(Long id, NoteRequest request) {
        User user = getCurrentUser();

        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Note not found or access denied"));

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());

        note = noteRepository.save(note);
        return mapToResponse(note);
    }

    @Transactional
    public void deleteNote(Long id) {
        User user = getCurrentUser();

        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Note not found or access denied"));

        noteRepository.delete(note);
    }
}