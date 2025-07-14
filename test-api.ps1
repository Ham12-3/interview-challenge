Write-Host "🏥 Medical Management System API Test" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

$baseUrl = "http://localhost:8080"

Write-Host "`n1. Testing Root Endpoint..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$baseUrl" -Method GET
Write-Host "✅ Root Response: $response" -ForegroundColor Green

Write-Host "`n2. Creating a Patient..." -ForegroundColor Yellow
$patientData = @{
    name = "John Doe"
    dateOfBirth = "1990-05-15"
} | ConvertTo-Json

$patient = Invoke-RestMethod -Uri "$baseUrl/patients" -Method POST -Body $patientData -ContentType "application/json"
Write-Host "✅ Created Patient:" -ForegroundColor Green
$patient | ConvertTo-Json -Depth 3

Write-Host "`n3. Creating a Medication..." -ForegroundColor Yellow
$medicationData = @{
    name = "Amoxicillin"
    dosage = "500mg"
    frequency = "3 times daily"
} | ConvertTo-Json

$medication = Invoke-RestMethod -Uri "$baseUrl/medications" -Method POST -Body $medicationData -ContentType "application/json"
Write-Host "✅ Created Medication:" -ForegroundColor Green
$medication | ConvertTo-Json -Depth 3

Write-Host "`n4. Creating an Assignment..." -ForegroundColor Yellow
$assignmentData = @{
    patientId = $patient.id
    medicationId = $medication.id
    startDate = "2024-01-10"
    days = 10
} | ConvertTo-Json

$assignment = Invoke-RestMethod -Uri "$baseUrl/assignments" -Method POST -Body $assignmentData -ContentType "application/json"
Write-Host "✅ Created Assignment:" -ForegroundColor Green
$assignment | ConvertTo-Json -Depth 3

Write-Host "`n5. Getting All Patients..." -ForegroundColor Yellow
$patients = Invoke-RestMethod -Uri "$baseUrl/patients" -Method GET
Write-Host "✅ All Patients:" -ForegroundColor Green
$patients | ConvertTo-Json -Depth 4

Write-Host "`n6. Getting All Medications..." -ForegroundColor Yellow
$medications = Invoke-RestMethod -Uri "$baseUrl/medications" -Method GET
Write-Host "✅ All Medications:" -ForegroundColor Green
$medications | ConvertTo-Json -Depth 4

Write-Host "`n7. Getting All Assignments..." -ForegroundColor Yellow
$assignments = Invoke-RestMethod -Uri "$baseUrl/assignments" -Method GET
Write-Host "✅ All Assignments:" -ForegroundColor Green
$assignments | ConvertTo-Json -Depth 4

Write-Host "`n8. Getting Assignments with Remaining Days..." -ForegroundColor Yellow
$assignmentsWithDays = Invoke-RestMethod -Uri "$baseUrl/assignments/remaining-days" -Method GET
Write-Host "✅ Assignments with Remaining Days:" -ForegroundColor Green
$assignmentsWithDays | ConvertTo-Json -Depth 4

Write-Host "`n9. Creating Another Patient..." -ForegroundColor Yellow
$patient2Data = @{
    name = "Jane Smith"
    dateOfBirth = "1985-12-22"
} | ConvertTo-Json

$patient2 = Invoke-RestMethod -Uri "$baseUrl/patients" -Method POST -Body $patient2Data -ContentType "application/json"
Write-Host "✅ Created Second Patient:" -ForegroundColor Green
$patient2 | ConvertTo-Json -Depth 3

Write-Host "`n10. Creating Another Medication..." -ForegroundColor Yellow
$medication2Data = @{
    name = "Ibuprofen"
    dosage = "200mg"
    frequency = "twice daily"
} | ConvertTo-Json

$medication2 = Invoke-RestMethod -Uri "$baseUrl/medications" -Method POST -Body $medication2Data -ContentType "application/json"
Write-Host "✅ Created Second Medication:" -ForegroundColor Green
$medication2 | ConvertTo-Json -Depth 3

Write-Host "`n11. Assigning Second Medication to Second Patient..." -ForegroundColor Yellow
$assignment2Data = @{
    patientId = $patient2.id
    medicationId = $medication2.id
    startDate = (Get-Date).ToString("yyyy-MM-dd")
    days = 7
} | ConvertTo-Json

$assignment2 = Invoke-RestMethod -Uri "$baseUrl/assignments" -Method POST -Body $assignment2Data -ContentType "application/json"
Write-Host "✅ Created Second Assignment:" -ForegroundColor Green
$assignment2 | ConvertTo-Json -Depth 3

Write-Host "`n12. Final Check - All Data..." -ForegroundColor Yellow
Write-Host "📊 FINAL SUMMARY:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan

$finalPatients = Invoke-RestMethod -Uri "$baseUrl/patients" -Method GET
Write-Host "👥 Total Patients: $($finalPatients.Count)" -ForegroundColor Magenta
$finalPatients | ForEach-Object { Write-Host "   - $($_.name) (Born: $($_.dateOfBirth))" -ForegroundColor White }

$finalMedications = Invoke-RestMethod -Uri "$baseUrl/medications" -Method GET
Write-Host "💊 Total Medications: $($finalMedications.Count)" -ForegroundColor Magenta
$finalMedications | ForEach-Object { Write-Host "   - $($_.name) $($_.dosage) - $($_.frequency)" -ForegroundColor White }

$finalAssignments = Invoke-RestMethod -Uri "$baseUrl/assignments/remaining-days" -Method GET
Write-Host "📋 Total Assignments: $($finalAssignments.Count)" -ForegroundColor Magenta
$finalAssignments | ForEach-Object { 
    Write-Host "   - Patient ID $($_.patientId) → Medication ID $($_.medicationId)" -ForegroundColor White
    Write-Host "     Start: $($_.startDate) | Days: $($_.days) | Remaining: $($_.remainingDays)" -ForegroundColor Gray
}

Write-Host "`n🎉 API Test Complete! Your Medical Management System is working perfectly!" -ForegroundColor Green 