from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SimulationLog


TARGET_PASSWORD = "blue123"


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def brute_force_simulation(request):
    password_attempt = request.data.get("password")

    if not password_attempt:
        return Response({"error": "Password required"}, status=400)

    TARGET_PASSWORD = "blue123"
    success = password_attempt == TARGET_PASSWORD

    SimulationLog.objects.create(
        user=request.user,
        attack_type="Brute Force",
        input_data=password_attempt,
        success=success
    )

    if success:
        progress = request.user.userprogress

        # Example: mark BF Level 2 Part 1 complete
        if not progress.bf_l2_p1:
            progress.bf_l2_p1 = True
            progress.save()
            request.user.update_rank()

        return Response({
            "status": "Access Granted",
            "rank": request.user.rank,
            "total_completed": progress.parts_completed()
        })

    return Response({
        "status": "Access Denied"
    })
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sql_injection_simulation(request):
    payload = request.data.get("payload")

    if not payload:
        return Response({"error": "Payload required"}, status=400)

    suspicious_patterns = [
        "' OR 1=1 --",
        "' OR '1'='1",
        "DROP TABLE",
        "UNION SELECT"
    ]

    success = any(pattern.lower() in payload.lower() for pattern in suspicious_patterns)

    SimulationLog.objects.create(
        user=request.user,
        attack_type="SQL Injection",
        input_data=payload,
        success=success
    )

    if success:
        progress = request.user.userprogress

        # Example: mark SQLi Level 2 Part 1 complete
        if not progress.sqli_l2_p1:
            progress.sqli_l2_p1 = True
            progress.save()
            request.user.update_rank()

        return Response({
            "status": "Injection Successful",
            "rank": request.user.rank,
            "total_completed": progress.parts_completed()
        })

    return Response({
        "status": "Query Safe"
    })