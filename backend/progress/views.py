from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserProgress

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_part(request):
    part = request.data.get("part")

    progress = request.user.userprogress

    if hasattr(progress, part):
        setattr(progress, part, True)
        progress.save()

        request.user.update_rank()

        return Response({
            "message": "Part completed",
            "rank": request.user.rank,
            "total_completed": progress.parts_completed()
        })

    return Response({"error": "Invalid part"}, status=400)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def progress_status(request):
    progress = request.user.userprogress

    data = {
        "bf_l1_p1": progress.bf_l1_p1,
        "bf_l1_p2": progress.bf_l1_p2,
        "bf_l1_p3": progress.bf_l1_p3,

        "bf_l2_p1": progress.bf_l2_p1,
        "bf_l2_p2": progress.bf_l2_p2,
        "bf_l2_p3": progress.bf_l2_p3,

        "bf_l3_p1": progress.bf_l3_p1,
        "bf_l3_p2": progress.bf_l3_p2,
        "bf_l3_p3": progress.bf_l3_p3,

        "sqli_l1_p1": progress.sqli_l1_p1,
        "sqli_l1_p2": progress.sqli_l1_p2,
        "sqli_l1_p3": progress.sqli_l1_p3,

        "sqli_l2_p1": progress.sqli_l2_p1,
        "sqli_l2_p2": progress.sqli_l2_p2,
        "sqli_l2_p3": progress.sqli_l2_p3,

        "sqli_l3_p1": progress.sqli_l3_p1,
        "sqli_l3_p2": progress.sqli_l3_p2,
        "sqli_l3_p3": progress.sqli_l3_p3,

        "total_completed": progress.parts_completed(),
        "rank": request.user.rank
    }

    return Response(data)