package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type Request struct {
	Events []json.RawMessage `json:"events"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Cannot read body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var req Request
	if err := json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(req.Events)
}

func main() {
	http.HandleFunc("/", handler)
	log.Println("Server running on http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
